def normalize_skill(skill):
    return skill.strip().lower()


def calculate_skill_match(user_skills, job_skills):

    # Handle missing/empty skill lists safely
    user_skills = user_skills or []
    job_skills = job_skills or []

    # Create normalized sets for comparison
    user_normalized = {
        normalize_skill(skill)
        for skill in user_skills
        if skill and skill.strip()
    }

    job_normalized = {
        normalize_skill(skill)
        for skill in job_skills
        if skill and skill.strip()
    }

    # Find matched and missing skills
    matched_normalized = user_normalized.intersection(
        job_normalized
    )

    missing_normalized = job_normalized - user_normalized

    # Preserve the original job skill names in the response
    job_original = {
        normalize_skill(skill): skill.strip()
        for skill in job_skills
        if skill and skill.strip()
    }

    matched_skills = [
        job_original[skill]
        for skill in matched_normalized
    ]

    missing_skills = [
        job_original[skill]
        for skill in missing_normalized
    ]

    # Calculate match percentage
    if not job_normalized:
        match_percentage = 0
    else:
        match_percentage = round(
            (len(matched_normalized) / len(job_normalized)) * 100,
            2
        )

    return {
        "match_percentage": match_percentage,
        "matched_skills": matched_skills,
        "missing_skills": missing_skills
    }